// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
contract PrivateCourseFallback {
    event CourseRegistered(uint256 indexed courseId, bytes ciphertext);
    function registerCourse(uint256 courseId, bytes calldata ciphertext) external {
        emit CourseRegistered(courseId, ciphertext);
    }
}
