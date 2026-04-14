# SkillSync

SkillSync is a platform designed to help users find people with matching skills for collaboration on projects. It enables users to create a profile with their skills, interests, and availability, and connect with others based on shared expertise or learning goals.

## Features

- **User Authentication**: Sign in using Firebase Authentication to manage user accounts securely.
- **Profile Management**: Users can create and update their profiles with details such as skills, interests, bio, and availability.
- **Search for Collaborators**: Users can search for other users with specific skills or interests.
- **Matching Logic**: SkillSync uses a matching algorithm to suggest users based on their skills and availability.
- **Firebase Integration**: The app is integrated with Firebase for user authentication and data storage.

### Firestore Structure

- `users` collection:
  - `userId`: Unique user ID (from Firebase Authentication)
  - `name`: User's full name
  - `email`: User's email address
  - `bio`: A short user description
  - `skills`: Array of skills the user has
  - `interests`: Array of skills/topics the user wants to learn
  - `experienceLevel`: User's experience level (e.g., Beginner, Intermediate, Expert)
  - `availability`: User's available time for collaboration (e.g., weekends, evenings)
  - `createdAt`: Timestamp when the profile was created
  - `updatedAt`: Timestamp of the last profile update

## Contributing

We welcome contributions to SkillSync! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Firebase for providing easy-to-use backend services like authentication and Firestore.
- The open-source community for their continuous contributions.

## Demo video link
https://drive.google.com/file/d/1UqZcTqAT7fyqL-mpkv6cRy--ym0KF2dw/view?usp=drive_link

##
