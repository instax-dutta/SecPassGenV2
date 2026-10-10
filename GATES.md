# Gates: stateless password uniqueness

OWNS: lib/**, app/api/generate/route.ts, components/PasswordGenerator.tsx, components/AnimatedBackground.tsx, app/privacy/page.tsx, app/terms/page.tsx, scripts/**, GATES.md, .env.example, .eslintrc.json, package.json, tsconfig.json, README.md, app/AGENTS.md, app/api/AGENTS.md, lib/AGENTS.md, components/AGENTS.md, AGENTS.md

Scope: replace per-request database uniqueness checks with an enforced entropy floor, unbiased character selection, per-session duplicate suppression, and a single atomic keyed-hash insert.

- [x] G0: this ledger's own oracles are lint-clean
  CHECK: node /Users/saiduttaabhishekdash/.agents/skills/unlazy/scripts/gate-lint.mjs GATES.md
  EXPECT: LINT OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=ac2362a5e404f55f3e0757bb13c502652d0244eaefefbc244421b340eed8ed2a; exit=0; EXPECT=matched; output-sha256=eb36213429e100f4681a3d8b3d2ca29e4e0f490607f6a77790b5723e65d6f2b7; output-bytes=270; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G1: configurations below 60 bits of entropy are rejected and compliant ones are accepted, with the minimum length agreeing with the floor
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-entropy-floor.mjs
  EXPECT: ENTROPY FLOOR VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=eee08b30bbb22bef6819523e8583b9595eafe82659956de5fe719e9d88c77337; exit=0; EXPECT=matched; output-sha256=bda2a31e5edb04923d2d2f060f67e4409b85f53cbe37cbaeed8fdea60d3a903e; output-bytes=91; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G2: character selection is uniform by construction, rejects the biased residue range, and no unconditional modulo indexing survives in the source
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-random-sampling.mjs
  EXPECT: RANDOM SAMPLING VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=60c1d72cc5ceff0efac03a761c13c8d2813bb80807a592b7a7e460dc7402174c; exit=0; EXPECT=matched; output-sha256=00b4f6faf17ea16d4a15d0a1f7fa71242e4bdfb30b83bcda0322f081e6c80afc; output-bytes=107; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G3: a password already shown this session is refused, and the resident set never exceeds its cap
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-session-dedup.mjs
  EXPECT: SESSION DEDUP VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=4211c03fd1357e3282d027a1670b547a0a47b3ee1738e18c85e1ae22cf67ed5e; exit=0; EXPECT=matched; output-sha256=4deb653b4b32ad642ec08c9fe170fdf030f47ab9f6dfb3d8f39ef181db2d6e97; output-bytes=98; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G4: the IP hash actually consumes its salt and cannot silently hash the literal string "undefined"
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-hash-ip.mjs
  EXPECT: HASHIP SALT VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=a7dbc0e92166fdb79aae29417c3694ece663d87bfc55932a2e14fe1202db3041; exit=0; EXPECT=matched; output-sha256=6f8fc32e17328775e9d07a3c4b69c4e26ff40789555e2b0758cbc3b190e3f860; output-bytes=81; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G5: the stored signature is an HMAC-SHA-256 matching an independent implementation, not a bare digest
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-keyed-hash.mjs
  EXPECT: KEYED HASH VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=90ba32dc7c3b100bc86242d4c01d26aac57a141b4be93d71ccb0f9314fea7400; exit=0; EXPECT=matched; output-sha256=4d993183df847106e8c3ebfedb0615718ed1c1a9fb568b9c5318c8f6c7210f7b; output-bytes=90; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G6: recording is one ON CONFLICT ... DO NOTHING ... RETURNING statement with no prior COUNT(*) probe
  CHECK: node scripts/check-atomic-insert.mjs
  EXPECT: ATOMIC INSERT VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=fdaf245f68037c8317ec813fe91f895b16c44d4d25582a0e7ffaae9735f8c937; exit=0; EXPECT=matched; output-sha256=78cdc5462d02bcc26f3a140cb482f6bf9f90a68ff8156777c1686558726e0d01; output-bytes=110; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G7: a missing, empty or short UNIQUENESS_SECRET throws instead of degrading to a known constant
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-uniqueness-secret.mjs
  EXPECT: UNIQUENESS SECRET VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=fc2976e2522bbe24b6670394f53ecde5967c1ac7893153b13834553bd8cc6c23; exit=0; EXPECT=matched; output-sha256=1baf4cd98f389776ba747d7a30ec0c2fcdfc6d77099530b0089acbd1d1d8b2ad; output-bytes=105; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G8: the project type-checks with no errors
  CHECK: npx tsc --noEmit && echo TYPECHECK CLEAN
  EXPECT: TYPECHECK CLEAN
  EVIDENCE: automatic-evidence=v1; definition-sha256=cefd99093d571ca75ab6f2482eef74831978d6c7dfae9e3654c911f1d9a1f9fd; exit=0; EXPECT=matched; output-sha256=d97583ffdf2e55b2408c3adfcb9e304534c43953282dc0765c297d8f20482458; output-bytes=16; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G9: the project lints with no errors
  CHECK: npm run lint && echo LINT CLEAN
  EXPECT: LINT CLEAN
  EVIDENCE: automatic-evidence=v1; definition-sha256=679bf49cb3aab93596f0570f43711f9c4ddb34dab30d7de837cf9f357020a76f; exit=0; EXPECT=matched; output-sha256=11652aeaf4cd92f000fd19aa01fcc06f7b549deca2332773f95b92380cd7ae4b; output-bytes=86; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G10: the running route rejects an under-floor request with 400 before any database access, while a compliant request is not rejected on entropy grounds
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-route-integration.mjs
  EXPECT: ROUTE INTEGRATION VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=1cae96d3bcdc214313bbd37d337063f669a2185cbf32de5b9898a55dc0f85d96; exit=0; EXPECT=matched; output-sha256=326ab269aa4d7ca3e24160ce4dd189d20372ef3d9bfc2fc87657382636538280; output-bytes=117; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G11: the DOX tree describes the new contract and the published privacy claims have been reconciled with the code
  EVIDENCE: reviewed 2026-10-10. Root, lib/, app/api/ and components/ AGENTS.md rewritten for the entropy floor, rejection sampling, keyed HMAC, atomic insert and session dedup. Reconciled every published surface that overstated the old behaviour: app/privacy/page.tsx (removed "anonymized SHA-256 hashes to guarantee global password uniqueness", now describes the 60-bit floor and keyed HMAC), app/layout.tsx APP_DESCRIPTION (removed "database-backed uniqueness verification"), app/page.tsx feature card ("DB Verified" -> "60-Bit Floor"), README (features, quick start and privacy bullets). Grepped the repo for "SHA-256", "DB Verified", "guarantee global password uniqueness" and "irreversibly hashed"; every remaining hit is a genuine HMAC primitive or a browser-local digest. Recorded the low-entropy device-fingerprint caveat on lib/passwordHistory.ts in lib/AGENTS.md.

- [ ] G12: production deploy readiness for the new required secret and the existing hashed rows
  EVIDENCE: item 1 done and verified 2026-10-10. UNIQUENESS_SECRET was provisioned on Vercel project instaxduttas-projects/sec-pass-gen-v2 (the project serving passwords.sdad.pro) across production, preview and development, generated with `openssl rand -base64 48` and piped in rather than passed in argv. `vercel env ls` confirms it present on all three. Vercel auto-classified production and preview as write-only Secret; development was stored as a retrievable Config value holding the same string. Anyone with deploy rights could exfiltrate the production secret by shipping code regardless, so the write-only flag is defence in depth rather than a real boundary; treat the value as permanent and never rotate it without also truncating generated_passwords.
  Item 2 still open and needs an owner decision. `generated_passwords` currently holds rows whose password_hash is a bare SHA-256 while new rows are HMAC-SHA-256. They share one unique column but can never match, so previously issued passwords become re-issuable exactly once. Recommended: `TRUNCATE public.generated_passwords` before the first deploy with this code, which is safe now that the entropy floor rather than the table carries uniqueness. Keeping the rows is defensible but should be a deliberate choice, not an omission. This gate stays unmet until that decision is made and executed.
