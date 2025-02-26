export default function Avatar({ src, displayName }) {
  // Function to get initials from displayName
  const getInitials = (name) => {
    if (!name) return "U"; // Default to 'U' if no name is provided
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    return initials;
  };

  return (
    <div className="avatar">
      {src ? (
        <img src={src} alt={getInitials(displayName)} />
      ) : (
        <div className="avatar-placeholder">{getInitials(displayName)}</div>
      )}
    </div>
  );
}
