export default Utils = {
  getRandomAvatarUrl() {
    const randomAvatar = Math.floor(Math.random() * 16) + 1;
    return `/avatars/avatar-placeholder-${randomAvatar}.png`;
  },

  showError(errorMsg) {
    toastr.error(errorMsg);
  },

  isProduction() {
    return process.env.NODE_ENV !== 'development';
  },

  generateUserInitials(userProfile) {
    const { firstName, lastName} = userProfile;
    let initials = '';
    if (firstName) {
      initials += firstName.charAt(0);
    }

    if (lastName) {
      initials += lastName.charAt(0);
    }

    return initials.toUpperCase();
  }
}
