#!/usr/bin/env bats

setup() {
  TEST_TEMP_DIR="$(mktemp -d)"

  # Extract function definitions from start-application.sh without triggering
  # the script's main execution code (which runs docker, etc.).
  # Uses sed to capture function bodies by matching the function name line
  # through the closing brace at the start of a line.
  eval "$(sed -n '/^validate_password()/,/^}/p' "${BATS_TEST_DIRNAME}/../../start-application.sh")"
}

teardown() {
  rm -rf "$TEST_TEMP_DIR"
}

# === Acceptance tests (return 0) ===

@test "accepts 20-char minimum valid password" {
  # 20 chars satisfying all requirements:
  # lowercase + uppercase + digit + special = 4 chars + 16 lowercase = 20
  run validate_password "Ab1!aaaaaaaaaaaaaaaa"
  [ "$status" -eq 0 ]
}

@test "accepts 128-char maximum valid password" {
  # 4 chars for the required classes + 124 'a' chars = 128 total
  password="Ab1!$(printf 'a%.0s' {1..124})"
  run validate_password "$password"
  [ "$status" -eq 0 ]
}

@test "accepts special char @" {
  run validate_password "Password1234567890@@@"
  [ "$status" -eq 0 ]
}

@test "accepts special char _" {
  run validate_password "Password1234567890___"
  [ "$status" -eq 0 ]
}

@test "accepts special char %" {
  run validate_password "Password1234567890%%%"
  [ "$status" -eq 0 ]
}

@test "accepts special char +" {
  run validate_password "Password1234567890+++"
  [ "$status" -eq 0 ]
}

@test "accepts special char =" {
  run validate_password "Password1234567890==="
  [ "$status" -eq 0 ]
}

@test "accepts special char :" {
  run validate_password "Password1234567890:::"
  [ "$status" -eq 0 ]
}

@test "accepts special char ," {
  run validate_password "Password1234567890,,,"
  [ "$status" -eq 0 ]
}

@test "accepts special char ." {
  run validate_password "Password1234567890..."
  [ "$status" -eq 0 ]
}

@test "accepts special char !" {
  run validate_password "Password1234567890!!!"
  [ "$status" -eq 0 ]
}

@test "accepts special char ?" {
  run validate_password "Password1234567890???"
  [ "$status" -eq 0 ]
}

@test "accepts special char -" {
  run validate_password "Password1234567890---"
  [ "$status" -eq 0 ]
}

# === Rejection tests (return 1) ===

@test "rejects < 20 chars" {
  # 19 chars satisfying all class requirements
  run validate_password "Ab1!aaaaaaaaaaaaaaa"
  [ "$status" -eq 1 ]
}

@test "rejects > 128 chars" {
  password="Ab1!$(printf 'a%.0s' {1..125})"
  run validate_password "$password"
  [ "$status" -eq 1 ]
}

@test "rejects password with space" {
  run validate_password "Password 1234567890!!"
  [ "$status" -eq 1 ]
}

@test "rejects password with tab" {
  password="Password	1234567890!!"
  run validate_password "$password"
  [ "$status" -eq 1 ]
}

@test "rejects password with newline" {
  password=$'Password\n1234567890!!'
  run validate_password "$password"
  [ "$status" -eq 1 ]
}

@test "rejects password with carriage return" {
  password=$'Password\r1234567890!!'
  run validate_password "$password"
  [ "$status" -eq 1 ]
}

@test "rejects unsupported char #" {
  run validate_password "Password1234567890###"
  [ "$status" -eq 1 ]
}

@test "rejects unsupported char $" {
  run validate_password "Password1234567890$$$"
  [ "$status" -eq 1 ]
}

@test "rejects unsupported char ^" {
  run validate_password "Password1234567890^^^"
  [ "$status" -eq 1 ]
}

@test "rejects unsupported char &" {
  run validate_password "Password1234567890&&&"
  [ "$status" -eq 1 ]
}

@test "rejects unsupported char *" {
  run validate_password "Password1234567890***"
  [ "$status" -eq 1 ]
}

@test "rejects missing lowercase" {
  run validate_password "PASSWORD1234567890!!!"
  [ "$status" -eq 1 ]
}

@test "rejects missing uppercase" {
  run validate_password "password1234567890!!!"
  [ "$status" -eq 1 ]
}

@test "rejects missing digit" {
  run validate_password "Password!!!!!!!!!!!!!!"
  [ "$status" -eq 1 ]
}

@test "rejects missing special char" {
  run validate_password "Password123456789000"
  [ "$status" -eq 1 ]
}
