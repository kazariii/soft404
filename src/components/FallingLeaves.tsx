import type { CSSProperties } from "react"

const leaves = [
  { left: "4%", delay: "-3s", duration: "17s", size: "15px", drift: "90px" },
  { left: "14%", delay: "-11s", duration: "22s", size: "11px", drift: "-70px" },
  { left: "26%", delay: "-6s", duration: "19s", size: "17px", drift: "110px" },
  { left: "39%", delay: "-15s", duration: "25s", size: "10px", drift: "-95px" },
  { left: "52%", delay: "-2s", duration: "21s", size: "14px", drift: "75px" },
  { left: "64%", delay: "-13s", duration: "24s", size: "12px", drift: "-110px" },
  { left: "76%", delay: "-8s", duration: "18s", size: "16px", drift: "85px" },
  { left: "88%", delay: "-17s", duration: "26s", size: "10px", drift: "-65px" },
  { left: "95%", delay: "-5s", duration: "20s", size: "13px", drift: "-120px" },
] as const

function FallingLeaves() {
  return (
    <div className="falling-leaves" aria-hidden="true">
      {leaves.map((leaf, index) => (
        <span
          className={`falling-leaf falling-leaf-${(index % 3) + 1}`}
          key={`${leaf.left}-${leaf.delay}`}
          style={
            {
              "--leaf-left": leaf.left,
              "--leaf-delay": leaf.delay,
              "--leaf-duration": leaf.duration,
              "--leaf-size": leaf.size,
              "--leaf-drift": leaf.drift,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 100 120" role="presentation">
            <path
              className="maple-leaf-shape"
              d="M50 1 60 24 76 13 72 38 98 31 84 53 95 59 65 73 70 95 53 85 54 119 46 119 47 85 30 95 35 73 5 59 16 53 2 31 28 38 24 13 40 24Z"
            />
            <path
              className="maple-leaf-vein"
              d="M50 9v99M50 67 22 44M50 67 78 44M50 51 36 26M50 51 64 26"
            />
          </svg>
        </span>
      ))}
    </div>
  )
}

export default FallingLeaves
