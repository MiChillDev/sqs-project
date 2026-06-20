#!/usr/bin/env bats

setup() {
  TEST_TEMP_DIR="$(mktemp -d)"

  # Extract function definitions from start-application.sh without triggering
  # the script's main execution code (which runs docker, etc.).
  # Uses sed to capture function bodies by matching the function name line
  # through the closing brace at the start of a line.
  eval "$(sed -n '/^validate_username()/,/^}/p' "${BATS_TEST_DIRNAME}/../../start-application.sh")"
}

teardown() {
  rm -rf "$TEST_TEMP_DIR"
}

# === Acceptance tests (return 0) ===

@test "accepts 3-char minimum: abc" {
  run validate_username "abc"
  [ "$status" -eq 0 ]
}

@test "accepts 64-char maximum" {
  username="$(printf 'a%.0s' {1..64})"
  run validate_username "$username"
  [ "$status" -eq 0 ]
}

@test "accepts dots, underscores, hyphens: admin.user_test-01" {
  run validate_username "admin.user_test-01"
  [ "$status" -eq 0 ]
}

# === Rejection tests (return 1) ===

@test "rejects < 3 chars: ad" {
  run validate_username "ad"
  [ "$status" -eq 1 ]
}

@test "rejects > 64 chars" {
  username="$(printf 'a%.0s' {1..65})"
  run validate_username "$username"
  [ "$status" -eq 1 ]
}

@test "rejects empty string" {
  run validate_username ""
  [ "$status" -eq 1 ]
}

@test "rejects spaces: admin user" {
  run validate_username "admin user"
  [ "$status" -eq 1 ]
}

@test "rejects special char !: admin!" {
  run validate_username "admin!"
  [ "$status" -eq 1 ]
}

@test "rejects special char @: ad@min" {
  run validate_username "ad@min"
  [ "$status" -eq 1 ]
}
