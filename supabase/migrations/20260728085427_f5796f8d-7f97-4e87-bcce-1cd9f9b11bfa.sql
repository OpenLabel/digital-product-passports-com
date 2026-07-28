CREATE OR REPLACE FUNCTION public.reorder_passports(p_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  IF p_ids IS NULL OR array_length(p_ids, 1) IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.passports p
  SET display_order = ord.idx - 1,
      updated_at = now()
  FROM unnest(p_ids) WITH ORDINALITY AS ord(id, idx)
  WHERE p.id = ord.id
    AND p.user_id = v_user;
END;
$$;

REVOKE ALL ON FUNCTION public.reorder_passports(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reorder_passports(uuid[]) TO authenticated;
