const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');

let localStream;
let remoteStream;
let pc1;  // PeerConnection for local user
let pc2;  // PeerConnection for remote user

const servers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }  // Using a public STUN server
  ]
};

startButton.addEventListener('click', startCall);
hangupButton.addEventListener('click', hangupCall);

async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    pc1 = new RTCPeerConnection(servers);
    pc1.onicecandidate = (event) => {
      if (event.candidate) {
        pc2.addIceCandidate(event.candidate);
      }
    };

    pc2 = new RTCPeerConnection(servers);
    pc2.onicecandidate = (event) => {
      if (event.candidate) {
        pc1.addIceCandidate(event.candidate);
      }
    };
    pc2.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };

    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
    await pc2.setRemoteDescription(offer);

    const answer = await pc2.createAnswer();
    await pc2.setLocalDescription(answer);
    await pc1.setRemoteDescription(answer);
  } catch (error) {
    console.error('Error starting the call:', error);
  }
}

function hangupCall() {
  localStream.getTracks().forEach(track => track.stop());
  pc1.close();
  pc2.close();
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}
