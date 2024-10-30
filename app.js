const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const callButton = document.getElementById('callButton');
const hangUpButton = document.getElementById('hangUpButton');

let localStream;
let remoteStream;
let peerConnection;

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

callButton.onclick = startCall;
hangUpButton.onclick = hangUp;

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('Nuevo candidato ICE', event.candidate);
            // Aquí deberías enviar el candidato al otro peer
        }
    };

    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Oferta enviada', offer);
    // Aquí deberías enviar la oferta al otro peer
}

function hangUp() {
    peerConnection.close();
    console.log('Llamada colgada');
}

// Aquí deberías manejar la recepción de la oferta y los candidatos ICE
