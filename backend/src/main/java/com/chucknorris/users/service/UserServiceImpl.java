package com.chucknorris.users.service;

import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.users.repository.UserRepository;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Either<ErrorResultStatus, Optional<UserEntity>> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
