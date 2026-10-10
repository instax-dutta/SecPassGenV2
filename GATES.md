# Gates: stateless password generation

OWNS: lib/**, components/PasswordGenerator.tsx, app/**, scripts/**, GATES.md, .env.example, .eslintrc.json, package.json, package-lock.json, README.md, AGENTS.md

Scope: remove the database and every server-side artifact, so passwords are generated in the browser and never leave the device.

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
  EVIDENCE: automatic-evidence=v1; definition-sha256=60c1d72cc5ceff0efac03a761c13c8d2813bb80807a592b7a7e460dc7402174c; exit=0; EXPECT=matched; output-sha256=6c520dadffa270d4ff30ce75988ca799c576821362a15fa1b99f5d64a23e72e0; output-bytes=107; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G3: a password already shown this session is refused, and the resident set never exceeds its cap
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-session-dedup.mjs
  EXPECT: SESSION DEDUP VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=4211c03fd1357e3282d027a1670b547a0a47b3ee1738e18c85e1ae22cf67ed5e; exit=0; EXPECT=matched; output-sha256=4deb653b4b32ad642ec08c9fe170fdf030f47ab9f6dfb3d8f39ef181db2d6e97; output-bytes=98; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G4: the app has no server-side state, and every detector in that check fires against a fixture holding what was removed
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-no-server-state.mjs
  EXPECT: NO SERVER STATE VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=83cb3e664d2a6b3cf97047d1bb74e16bc6b809114b976871ab3ca5c501966fa0; exit=0; EXPECT=matched; output-sha256=bade09af120f5f92fba68c3f1f64464cfd845dad4996f5ffa4d407ed42b7f1b5; output-bytes=97; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G5: passwords are produced in the browser, and no component or library can reach the network
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-generation-is-local.mjs
  EXPECT: GENERATION IS LOCAL VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=9045e5c62532b0bb8003b73fe13afc6dce42504368b9ed98a95510773ff30a5f; exit=0; EXPECT=matched; output-sha256=3d8990327db4ab206b61a2559a7dfaac01ee2288315ab7998b08673cd339f2f8; output-bytes=96; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G6: the project type-checks with no errors
  CHECK: npx tsc --noEmit && echo TYPECHECK CLEAN
  EXPECT: TYPECHECK CLEAN
  EVIDENCE: automatic-evidence=v1; definition-sha256=cefd99093d571ca75ab6f2482eef74831978d6c7dfae9e3654c911f1d9a1f9fd; exit=0; EXPECT=matched; output-sha256=d97583ffdf2e55b2408c3adfcb9e304534c43953282dc0765c297d8f20482458; output-bytes=16; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G7: the project lints with no errors
  CHECK: npm run lint && echo LINT CLEAN
  EXPECT: LINT CLEAN
  EVIDENCE: automatic-evidence=v1; definition-sha256=679bf49cb3aab93596f0570f43711f9c4ddb34dab30d7de837cf9f357020a76f; exit=0; EXPECT=matched; output-sha256=11652aeaf4cd92f000fd19aa01fcc06f7b549deca2332773f95b92380cd7ae4b; output-bytes=86; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G8: the production build succeeds with every former database variable absent from the environment
  CHECK: env -u DATABASE_URL -u UNIQUENESS_SECRET -u IP_PEPPER -u IP_SALT npm run build && echo BUILD WITHOUT SECRETS CLEAN
  EXPECT: BUILD WITHOUT SECRETS CLEAN
  EVIDENCE: automatic-evidence=v1; definition-sha256=a37ea6c3c883c460ca6236e7edbb4efcccb2f0785177f2093ee5ef3133ee0797; exit=0; EXPECT=matched; output-sha256=7c8b7572aaea3948e7be4d9633a056a6eb65d2d0d1172b247da09573a12fb0f8; output-bytes=1512; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G10: a real browser, driving the live site, produces distinct passwords that match the on-screen controls and never leave the page
  CHECK: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-browser-e2e.mjs
  EXPECT: BROWSER END TO END VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=7a610f5feb55c60e7a30096f389281d5c9ee8e9d4c9e0ef88daf1b4e738d6aa5; exit=0; EXPECT=matched; output-sha256=aa5922143727041e2b7ecb30a94604b50552b333af038d9bfb4cfe9cb77df3d6; output-bytes=140; shell=/bin/sh; cwd=/Users/saiduttaabhishekdash/SecPassGenV2; path=b93c3fbfaca3/30 entries

- [x] G11: the DOX tree describes the stateless architecture and every published privacy claim matches it
  EVIDENCE: done 2026-10-10. On instaxduttas-projects/sec-pass-gen-v2, removed from all three environments: DATABASE_URL (a live PostgreSQL credential for the Neon project), UNIQUENESS_SECRET, and RATE_LIMIT_PER_HOUR, which was declared in the old .env.example but read by no code in the repo. IP_PEPPER was never created, confirmed by vercel reporting it as not found. Only NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_MAIN_DOMAIN remain, both cosmetic. Verified with `vercel env ls`, which now lists exactly those two.

- [x] G12: production environment purged of the credentials the app no longer uses
  EVIDENCE: done 2026-10-10. On instaxduttas-projects/sec-pass-gen-v2, removed from all three environments: DATABASE_URL (a live PostgreSQL credential for the Neon project), UNIQUENESS_SECRET, and RATE_LIMIT_PER_HOUR, which was declared in the old .env.example but read by no code in the repo. IP_PEPPER was never created, confirmed by vercel reporting it as not found. Only NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_MAIN_DOMAIN remain, both cosmetic. Verified with `vercel env ls`, which now lists exactly those two.