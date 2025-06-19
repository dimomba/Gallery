package com.example.galleryserver.repositories;

import java.util.List;
import com.example.galleryserver.models.Album;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlbumRepository extends MongoRepository<Album, String> {
    List<Album> findByUserId(String userId);
}
