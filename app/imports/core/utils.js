export default Utils = {
  getRandomAvatarUrl() {
    const randomAvatar = Math.floor(Math.random() * 16) + 1;
    return `/avatars/avatar-placeholder-${randomAvatar}.png`;
  }
}
