/**
 * HeroBlueprint — an abstract technical composition drawn entirely in SVG and
 * CSS. It is not a photograph and is not meant to read as one; it echoes an
 * architectural drawing of a software system.
 *
 * No image assets are used, so nothing here can be mistaken for a real picture.
 */

const NODES = [
  { x: 48, y: 40, w: 104, h: 30, label: 'client.web' },
  { x: 248, y: 40, w: 104, h: 30, label: 'client.app' },
  { x: 130, y: 130, w: 140, h: 34, label: 'api.gateway', accent: true },
  { x: 48, y: 220, w: 104, h: 30, label: 'service.auth' },
  { x: 248, y: 220, w: 104, h: 30, label: 'service.core' },
  { x: 130, y: 300, w: 140, h: 32, label: 'store.mysql' },
]

const EDGES = [
  'M100 70 V100 H180 V130',
  'M300 70 V100 H220 V130',
  'M200 164 V190 H100 V220',
  'M200 190 H300 V220',
  'M100 250 V280 H180 V300',
  'M300 250 V280 H220 V300',
]

const JUNCTIONS = [
  [100, 100],
  [300, 100],
  [200, 190],
  [100, 190],
  [300, 190],
  [100, 280],
  [300, 280],
]

export function HeroBlueprint() {
  return (
    <figure className="blueprint">
      <span className="blueprint__grid" aria-hidden="true" />
      <span className="blueprint__frame" aria-hidden="true" />
      <span className="blueprint__axis blueprint__axis--h" aria-hidden="true" />
      <span className="blueprint__axis blueprint__axis--v" aria-hidden="true" />

      <div className="blueprint__canvas">
        <svg
          className="blueprint__diagram"
          viewBox="0 0 400 360"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Abstract diagram of a layered software architecture: clients calling an API gateway, which routes to services, which reach a database."
        >
          {/* Connectors */}
          <g fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            {EDGES.map((d) => (
              <path key={d} d={d} className="stroke-muted" />
            ))}
          </g>

          {/* Junctions */}
          <g>
            {JUNCTIONS.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" className="stroke-ink" fill="currentColor" strokeWidth="0" />
            ))}
          </g>

          {/* Nodes */}
          <g>
            {NODES.map((node) => {
              const cx = node.x + node.w / 2
              const centerY = node.y + node.h / 2
              return (
                <g key={node.label}>
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    rx="3"
                    className={node.accent ? 'stroke-accent' : 'stroke-muted'}
                    fill="none"
                    strokeWidth="1"
                  />
                  {node.accent ? (
                    <rect
                      x={node.x + 4}
                      y={centerY - 1.5}
                      width={3}
                      height={3}
                      fill="currentColor"
                      strokeWidth="0"
                    />
                  ) : null}
                  <text x={cx} y={node.y + node.h + 13} textAnchor="middle" className={node.accent ? 'text text--accent' : 'text'}>
                    {node.label}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <span
        className="blueprint__node blueprint__node--accent"
        style={{ top: '18%', left: '18%' }}
        aria-hidden="true"
      />
      <span
        className="blueprint__node"
        style={{ top: '62%', left: '82%' }}
        aria-hidden="true"
      />
      <span className="blueprint__node-label" style={{ top: '18%', left: '18%' }} aria-hidden="true">
        0,0
      </span>
      <span className="blueprint__node-label" style={{ top: '62%', left: '82%' }} aria-hidden="true">
        1,1
      </span>

      <pre className="blueprint__code" aria-hidden="true">
        <code>
          <span className="tok-key">@Service</span>{'\n'}
          <span className="tok-key">public class</span> <span className="tok-fn">ContactService</span> {'{'}
          {'\n'}
          {'  '}
          <span className="tok-key">public void</span> <span className="tok-fn">send</span>(ContactRequest req) {'{'}
          {'\n'}
          {'    '}mailSender.<span className="tok-fn">send</span>(<span className="tok-fn">build</span>(req));
          {'\n'}
          {'    '}repository.<span className="tok-fn">save</span>(<span className="tok-str">"contact_messages"</span>);
          {'\n'}
          {'  '}
          {'}'}
          {'\n'}
          {'}'}
        </code>
      </pre>
    </figure>
  )
}
