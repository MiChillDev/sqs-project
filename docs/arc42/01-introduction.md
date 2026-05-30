# 1. Introduction and Goals

## Overview

Chuck Norris Joke Page (project name: **sqs-project**) is a web application that allows users to fetch, display, and manage Chuck Norris jokes. 
Unauthenticated users can browse jokes from the local database. 
Administrators can import jokes from the external Chuck Norris API and save them or create new jokes.

The system aggregates jokes from an external API (chucknorris.io) and provides a local database-backed joke repository with CRUD operations.

The project is a university project conducted by three students as part of a software quality assurance course.
The primary goal is to apply and demonstrate software architecture, quality assurance practices, and security fundamentals.

## Quality Goals

| Priority | Quality Attribute   | Description                                                                                                |
| -------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1        | **Testability**     | High automated test coverage with multi-layer testing strategy                                             |
| 2        | **Maintainability** | Clean, modular codebase with feature-based and domain-driven organization and clear separation of concerns |
| 3        | **Security**        | Secure authentication, password hashing, and protection against common web vulnerabilities                 |
| 4        | **Usability**       | Responsive, accessible UI with i18n support (English/German) and dark/light theme                          |
| 5        | **Reliability**     | Graceful error handling with functional error propagation and user-safe error messages                     |

## Stakeholders

| Role               | Contact                  | Expectations                                                            |
| ------------------ | ------------------------ | ----------------------------------------------------------------------- |
| Development Team   | Three student developers | Maintainable architecture, high test coverage, CI/CD automation         |
| University Faculty | Course instructors       | Demonstration of software quality practices, architecture documentation |
| End Users          | General public           | Fun, responsive Chuck Norris joke experience                            |
