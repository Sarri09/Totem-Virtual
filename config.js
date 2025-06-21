module.exports = {
  http: {
    listenIp  : '0.0.0.0',
    listenPort: 3001
  },

  https: {
    listenIp   : '0.0.0.0',
    listenPort : 4443,
    tls: {
      cert: '/server/certs/cert.pem',
      key : '/server/certs/key.pem'
    }
  },

  mediasoup: {
    numWorkers: 1,

    workerSettings: {
      rtcMinPort: 40000,
      rtcMaxPort: 40010,
      logLevel : 'warn',
      logTags   : ['ice','dtls','rtp','srtp','rtcp']
    },

    routerOptions: {
      mediaCodecs: [
        {
          kind      : 'audio',
          mimeType  : 'audio/opus',
          clockRate : 48000,
          channels  : 2
        },
        {
          kind      : 'video',
          mimeType  : 'video/VP8',
          clockRate : 90000,
          parameters: { 'x-google-start-bitrate': 1000 }
        }
      ]
    },

    webRtcTransportOptions: {
      listenIps: [
        {
          ip          : '0.0.0.0',
          announcedIp : process.env.ANNOUNCED_IP
        }
      ],
      initialAvailableOutgoingBitrate: 1000000,
      maxIncomingBitrate             : 1500000
    },

    plainTransportOptions: {
      listenIps: [
        {
          ip          : '0.0.0.0',
          announcedIp : process.env.ANNOUNCED_IP
        }
      ],
      portRange: { min: 40000, max: 40010 }
    },

    turnServers: [
      { urls: [ `stun:${process.env.ANNOUNCED_IP}:3478` ] },
      {
        urls      : [ `turn:${process.env.ANNOUNCED_IP}:3478?transport=udp` ],
        username  : process.env.TURN_USERNAME,
        credential: process.env.TURN_PASSWORD
      }
    ]
  }
};
