-- Create a table to track API usage per user
CREATE TABLE public.api_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    function_name text NOT NULL,
    month_year text NOT NULL, -- Format: YYYY-MM
    call_count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, function_name, month_year)
);

-- Enable RLS
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Users can only view their own usage
CREATE POLICY "Users can view their own usage"
ON public.api_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Only edge functions with service role can insert/update (no direct client access)
-- No INSERT/UPDATE/DELETE policies for authenticated users - only service role can modify

-- Add trigger for updated_at
CREATE TRIGGER update_api_usage_updated_at
BEFORE UPDATE ON public.api_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to increment usage and check limits (called by edge functions)
CREATE OR REPLACE FUNCTION public.increment_api_usage(
    p_user_id uuid,
    p_function_name text,
    p_limit integer DEFAULT 100
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_month_year text;
    v_current_count integer;
BEGIN
    -- Get current month in YYYY-MM format
    v_month_year := to_char(now(), 'YYYY-MM');
    
    -- Insert or update the usage count
    INSERT INTO public.api_usage (user_id, function_name, month_year, call_count)
    VALUES (p_user_id, p_function_name, v_month_year, 1)
    ON CONFLICT (user_id, function_name, month_year)
    DO UPDATE SET 
        call_count = api_usage.call_count + 1,
        updated_at = now()
    RETURNING call_count INTO v_current_count;
    
    -- Check if limit exceeded
    IF v_current_count > p_limit THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'current_count', v_current_count,
            'limit', p_limit,
            'message', 'Fair usage quota exceeded. Please contact us for higher limits.'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'allowed', true,
        'current_count', v_current_count,
        'limit', p_limit,
        'remaining', p_limit - v_current_count
    );
END;
$$;