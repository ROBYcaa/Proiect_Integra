package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userDetails")
public class UserDetail {

    @Id
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private int age;
    private int height;
    private int weight;
    private String sex;
    private String extraInfo;

    public UserDetail() {}

    public UserDetail(String userId, String firstName, String lastName, int age, int height, int weight, String sex, String extraInfo) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.height = height;
        this.weight = weight;
        this.sex = sex;
        this.extraInfo = extraInfo;
    }

    // Getteri și setteri
    public String getId() { return id; }

    public String getFirstName() {return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() {return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public int getHeight() { return height; }
    public void setHeight(int height) { this.height = height; }

    public int getWeight() { return weight; }
    public void setWeight(int weight) { this.weight = weight; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public String getExtraInfo() { return extraInfo; }
    public void setExtraInfo(String extraInfo) { this.extraInfo = extraInfo; }
}
