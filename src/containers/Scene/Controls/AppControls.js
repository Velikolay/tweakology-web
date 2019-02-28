import * as THREE from 'three';

const getNode = intersect => {
  const { parent: meshGroup } = intersect.object;
  const { parent: nodeGroup } = meshGroup;
  return nodeGroup;
};

class AppControls extends THREE.EventDispatcher {
  constructor(camera, domElement, objects) {
    super();
    this.objects = objects;
    this.camera = camera;
    this.domElement = domElement;

    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, -1));
    this.raycaster = new THREE.Raycaster();

    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.intersection = new THREE.Vector3();

    this.selected = null;
    this.hovered = null;

    this.enabled = true;

    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    this.onDocumentMouseCancel = this.onDocumentMouseCancel.bind(this);
    this.onDocumentTouchStart = this.onDocumentTouchStart.bind(this);
    this.onDocumentTouchEnd = this.onDocumentTouchEnd.bind(this);

    this.activate();
  }

  setObjects(objects) {
    this.objects = objects;
  }

  activate() {
    this.domElement.addEventListener(
      'mousemove',
      this.onDocumentMouseMove,
      false,
    );
    this.domElement.addEventListener(
      'mousedown',
      this.onDocumentMouseDown,
      false,
    );
    this.domElement.addEventListener(
      'mouseup',
      this.onDocumentMouseCancel,
      false,
    );
    this.domElement.addEventListener(
      'mouseleave',
      this.onDocumentMouseCancel,
      false,
    );
    this.domElement.addEventListener(
      'touchmove',
      this.onDocumentTouchMove,
      false,
    );
    this.domElement.addEventListener(
      'touchstart',
      this.onDocumentTouchStart,
      false,
    );
    this.domElement.addEventListener(
      'touchend',
      this.onDocumentTouchEnd,
      false,
    );
  }

  deactivate() {
    this.domElement.removeEventListener(
      'mousemove',
      this.onDocumentMouseMove,
      false,
    );
    this.domElement.removeEventListener(
      'mousedown',
      this.onDocumentMouseDown,
      false,
    );
    this.domElement.removeEventListener(
      'mouseup',
      this.onDocumentMouseCancel,
      false,
    );
    this.domElement.removeEventListener(
      'mouseleave',
      this.onDocumentMouseCancel,
      false,
    );
    this.domElement.removeEventListener(
      'touchmove',
      this.onDocumentTouchMove,
      false,
    );
    this.domElement.removeEventListener(
      'touchstart',
      this.onDocumentTouchStart,
      false,
    );
    this.domElement.removeEventListener(
      'touchend',
      this.onDocumentTouchEnd,
      false,
    );
  }

  dispose() {
    this.deactivate();
  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    const rect = this.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.selected && this.enabled) {
      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.selected.position.copy(this.intersection.sub(this.offset));
      }

      this.dispatchEvent({ type: 'drag', object: this.selected });
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects, true);

    if (intersects.length > 0) {
      if (this.hovered !== intersects[0]) {
        this.hovered = getNode(intersects[0]);
        this.domElement.style.cursor = 'pointer';
        this.dispatchEvent({ type: 'hoveron', object: this.hovered });
      }
    } else if (this.hovered !== null) {
      this.dispatchEvent({ type: 'hoveroff', object: this.hovered });
      this.domElement.style.cursor = 'auto';
      this.hovered = null;
    }
  }

  onDocumentMouseDown(event) {
    event.preventDefault();
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects, true);

    if (intersects.length > 0) {
      this.selected = getNode(intersects[0]);
      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.offset.copy(this.intersection).sub(this.selected.position);
      }
      this.domElement.style.cursor = 'move';
      this.dispatchEvent({ type: 'select', object: this.selected });
      this.dispatchEvent({ type: 'dragstart', object: this.selected });
    }
  }

  onDocumentMouseCancel(event) {
    event.preventDefault();
    if (this.selected) {
      this.dispatchEvent({ type: 'dragend', object: this.selected });
      this.selected = null;
    }
    this.domElement.style.cursor = this.hovered ? 'pointer' : 'auto';
  }

  onDocumentTouchMove(event) {
    event.preventDefault();
    const [e] = event.changedTouches;

    const rect = this.domElement.getBoundingClientRect();

    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.selected && this.enabled) {
      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.selected.position.copy(this.intersection.sub(this.offset));
      }
      this.dispatchEvent({ type: 'drag', object: this.selected });
    }
  }

  onDocumentTouchStart(event) {
    event.preventDefault();
    const [e] = event.changedTouches;

    const rect = this.domElement.getBoundingClientRect();

    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      this.selected = getNode(intersects[0]);
      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.offset.copy(this.intersection).sub(this.selected.position);
      }
      this.domElement.style.cursor = 'move';
      this.dispatchEvent({ type: 'select', object: this.selected });
      this.dispatchEvent({ type: 'dragstart', object: this.selected });
    }
  }

  onDocumentTouchEnd(event) {
    event.preventDefault();
    if (this.selected) {
      this.dispatchEvent({ type: 'dragend', object: this.selected });
      this.selected = null;
    }
    this.domElement.style.cursor = 'auto';
  }
}

export default AppControls;
