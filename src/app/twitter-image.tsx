import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#C9A96E',
              letterSpacing: '0.1em',
            }}
          >
            SATIN
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#F5F0EB',
              letterSpacing: '0.1em',
            }}
          >
            FABRICATION
          </span>
        </div>

        <span
          style={{
            marginTop: '24px',
            fontSize: '24px',
            color: '#8A8278',
            letterSpacing: '0.2em',
          }}
        >
          CUSTOM ARCHITECTURAL METALWORK
        </span>

        {/* Gold horizontal rule */}
        <div
          style={{
            marginTop: '40px',
            width: '100px',
            height: '2px',
            backgroundColor: '#C9A96E',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
