package com.example.galleryserver.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document
public class Comment {
    @Id
    private String id;

    @Field(name = "photo_id")
    private String photoId;

    @Field(name = "user_id")
    private String userId;

    @Field(name = "text")
    private String text;

    public Comment() {}

    public Comment(String photoId, String userId, String text) {
        this.photoId = photoId;
        this.userId = userId;
        this.text = text;
    }
}