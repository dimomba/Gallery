package com.example.galleryserver.repositories;

import com.example.galleryserver.models.Photo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface PublicationRepository extends MongoRepository<Photo, String> {
    List<Photo> findPhotosByUserid(String userid);

}
