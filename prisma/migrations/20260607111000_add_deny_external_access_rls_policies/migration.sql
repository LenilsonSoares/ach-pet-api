DO $$
DECLARE
  table_name text;
  table_names text[] := ARRAY[
    'AdopterProfile',
    'Adoption',
    'AdoptionRequest',
    'ChatThread',
    'Favorite',
    'FollowUpUpdate',
    'Message',
    'PasswordResetToken',
    'Pet',
    'PetPhoto',
    'PushToken',
    'ShelterProfile',
    'User',
    '_prisma_migrations'
  ];
BEGIN
  FOREACH table_name IN ARRAY table_names LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL
      AND NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = table_name
        AND policyname = 'deny_external_access'
    ) THEN
      EXECUTE format(
        'CREATE POLICY deny_external_access ON public.%I FOR ALL TO public USING (false) WITH CHECK (false)',
        table_name
      );
    END IF;
  END LOOP;
END $$;
