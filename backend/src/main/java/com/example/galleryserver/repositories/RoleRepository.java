package com.example.galleryserver.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.galleryserver.models.ERole;
import com.example.galleryserver.models.Role;

public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);
}
