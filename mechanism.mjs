export function typebarPose(arm, lift) {
  const rotation = arm.swing.clone().identity().slerp(arm.swing, Math.max(0, Math.min(1, lift)));
  const tip = arm.start.clone().addScaledVector(arm.restDirection.clone().applyQuaternion(rotation), arm.radius);
  const orientation = rotation.clone().multiply(arm.restOrientation);
  return { tip, orientation };
}
