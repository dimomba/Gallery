package com.example.galleryserver.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document
public class Like {
    @Id
    private String id;

    @Field(name = "photo_id")
    private String photoId;

    @Field(name = "user_id")
    private String userId;

    public Like() {}

    public Like(String photoId, String userId) {
        this.photoId = photoId;
        this.userId = userId;
    }
}