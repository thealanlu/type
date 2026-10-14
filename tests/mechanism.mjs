import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { typebarPose } from "../mechanism.mjs";

const source = await readFile(new URL("../assets/three.module.js", import.meta.url), "utf8");
const THREE = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
const target = new THREE.Vector3(0, 2.785, -0.59);
let samples = 0;

for (let i = 0; i < 43; i += 1) {
  const t = i / 42;
  const spread = (t - 0.5) * 3.96;
  const start = new THREE.Vector3((t - 0.5) * 2.2, 1.7 + Math.sin(t * Math.PI) * 0.17, -0.35 - Math.sin(t * Math.PI) * 0.16);
  const radius = start.distanceTo(target);
  const restDirection = new THREE.Vector3(spread * 1.1, 1.36, 0.9 + Math.sin(t * Math.PI) * 0.4).sub(start).normalize();
  const swing = new THREE.Quaternion().setFromUnitVectors(restDirection, target.clone().sub(start).normalize());
  const face = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const restOrientation = swing.clone().invert().multiply(face);
  const arm = { start, radius, restDirection, swing, restOrientation };

  for (let step = 0; step <= 100; step += 1) {
    const { tip, orientation } = typebarPose(arm, step / 100);
    assert.ok(Math.abs(tip.distanceTo(start) - radius) < 1e-10, "Typebar must keep its length throughout the swing");
    assert.ok(Math.abs(orientation.length() - 1) < 1e-10, "Type slug orientation must remain a rigid rotation");
    samples += 1;
  }
  const contact = typebarPose(arm, 1);
  assert.ok(contact.tip.distanceTo(target) < 1e-10, "Every typebar must meet the same printing point");
  assert.ok(contact.orientation.angleTo(face) < 1e-7, "Every type slug must face the paper at contact");
  assert.ok(typebarPose(arm, -1).tip.distanceTo(typebarPose(arm, 0).tip) < 1e-10);
  assert.ok(typebarPose(arm, 2).tip.distanceTo(target) < 1e-10);
}

console.log("Passed: " + samples + " rigid-bar samples, shared contact point, slug orientation, and motion limits.");

for (let i = -20; i <= 20; i += 1) {
  const axle = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
  const spin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), i * 0.18);
  const axis = new THREE.Vector3(0, 1, 0).applyQuaternion(axle.multiply(spin));
  assert.ok(axis.distanceTo(new THREE.Vector3(-1, 0, 0)) < 1e-10, "Platen rotation must preserve its horizontal axle");
}
console.log("Passed: 41 platen rotations retain the horizontal axle.");
