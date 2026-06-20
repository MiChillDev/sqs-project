#!/usr/bin/env bats

setup() {
  TEST_TEMP_DIR="$(mktemp -d)"

  eval "$(sed -n '/^generate_password()/,/^}/p; /^validate_password()/,/^}/p; /^generate_valid_password()/,/^}/p' "${BATS_TEST_DIRNAME}/../../start-application.sh")"
}

teardown() {
  rm -rf "$TEST_TEMP_DIR"
}

@test "generate_valid_password output passes validation" {
  password="$(generate_valid_password)"
  run validate_password "$password"
  [ "$status" -eq 0 ]
}

@test "generate_valid_password output is at least 32 characters" {
  password="$(generate_valid_password)"
  [ "${#password}" -ge 32 ]
}

@test "two consecutive calls produce different output" {
  pass1="$(generate_valid_password)"
  pass2="$(generate_valid_password)"
  [ "$pass1" != "$pass2" ]
}
