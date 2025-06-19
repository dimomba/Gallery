package com.example.galleryserver.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document
public class Album {
    @Id
    private String id;

    @Field(name = "user_id")
    private String userId; // ID пользователя, которому принадлежит альбом

    @Field(name = "name")
    private String name;

    @Field(name = "photos")
    private List<String> photoIds; // Список ID фотографий, которые принадлежат альбому

    public Album() {}

    public Album(String userId) {
        this.userId = userId;
    }
}
