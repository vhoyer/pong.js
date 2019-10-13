function Collider({
  x, y, width, height, onCollision,
}) {
  this.onFixedUpdate = () => ({
    topLeft: { x, y },
    bottomRight: { x: x + width, y: y + height },
  });

  this.onCollision = onCollision;
}

export default Collider;
