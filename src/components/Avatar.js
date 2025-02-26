import "./Avatar.css";

export default function Avatar({ src, displayName }) {
  const getInitialsImage = (name) => {
    if (!name) return "https://ui-avatars.com/api/?name=User&background=random";
    const formattedName = name.replace(/\s+/g, "+"); // Convert spaces to '+'
    return `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
  };

  return (
    <div className="avatar">
      <img src={src || getInitialsImage(displayName)} alt={displayName} />
    </div>
  );
}
