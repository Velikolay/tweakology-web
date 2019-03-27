const withFalsyGuard = transformerObj => ({
  fromPayload: (props, device) =>
    props ? transformerObj.fromPayload(props, device) : props,
  toPayload: (props, device) =>
    props ? transformerObj.toPayload(props, device) : props,
});

export default withFalsyGuard;
