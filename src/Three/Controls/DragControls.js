import * as THREE from 'three';

class DragControls extends THREE.EventDispatcher {
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

  setDraggableObjects(objects) {
    this.objects = objects;
  }

  activate() {
    this.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
    this.domElement.addEventListener('mouseup', this.onDocumentMouseCancel, false);
    this.domElement.addEventListener('mouseleave', this.onDocumentMouseCancel, false);
    this.domElement.addEventListener('touchmove', this.onDocumentTouchMove, false);
    this.domElement.addEventListener('touchstart', this.onDocumentTouchStart, false);
    this.domElement.addEventListener('touchend', this.onDocumentTouchEnd, false);
  }

  deactivate() {
    this.domElement.removeEventListener('mousemove', this.onDocumentMouseMove, false);
    this.domElement.removeEventListener('mousedown', this.onDocumentMouseDown, false);
    this.domElement.removeEventListener('mouseup', this.onDocumentMouseCancel, false);
    this.domElement.removeEventListener('mouseleave', this.onDocumentMouseCancel, false);
    this.domElement.removeEventListener('touchmove', this.onDocumentTouchMove, false);
    this.domElement.removeEventListener('touchstart', this.onDocumentTouchStart, false);
    this.domElement.removeEventListener('touchend', this.onDocumentTouchEnd, false);
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
        const pos = this.intersection.sub(this.offset);
        this.selected.elements.forEach(el => (
          el.position.copy(pos)
        ));
      }

      this.selected.elements.forEach(el => (
        this.dispatchEvent({ type: 'drag', object: el })
      ));
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects, true);

    if (intersects.length > 0) {
      const { object } = intersects[0];
      if (this.hovered !== object) {
        this.dispatchEvent({ type: 'hoveron', object });
        this.domElement.style.cursor = 'pointer';
        this.hovered = object;
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
      const obj = intersects[0].object;
      this.selected = {
        position: obj.position,
        elements: obj.parent.children,
      };

      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.offset.copy(this.intersection).sub(this.selected.position);
      }
      this.domElement.style.cursor = 'move';
      this.selected.elements.forEach(el => (
        this.dispatchEvent({ type: 'dragstart', object: el })
      ));
    }
  }

  onDocumentMouseCancel(event) {
    event.preventDefault();
    if (this.selected) {
      this.selected.elements.forEach(el => (
        this.dispatchEvent({ type: 'dragend', object: el })
      ));
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
        const pos = this.intersection.sub(this.offset);
        this.selected.elements.forEach(el => (
          el.position.copy(pos)
        ));
      }
      this.selected.elements.forEach(el => (
        this.dispatchEvent({ type: 'drag', object: el })
      ));
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
      const obj = this.intersects[0].object;
      this.selected = {
        position: obj.position,
        elements: obj.parent.children,
      };
      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.offset.copy(this.intersection).sub(this.selected.position);
      }
      this.domElement.style.cursor = 'move';
      this.selected.elements.forEach(el => (
        this.dispatchEvent({ type: 'dragstart', object: el })
      ));
    }
  }

  onDocumentTouchEnd(event) {
    event.preventDefault();
    if (this.selected) {
      this.selected.elements.forEach(el => (
        this.dispatchEvent({ type: 'dragend', object: el })
      ));
      this.selected = null;
    }
    this.domElement.style.cursor = 'auto';
  }
}

export default DragControls;
