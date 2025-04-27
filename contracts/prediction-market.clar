;; Trendlink Prediction Market
(define-constant ERR_UNAUTHORIZED u403)
(define-constant ERR_INVALID_DESCRIPTION u400)

;; Market Tracking Variable
(define-data-var market-counter uint u0)
(define-constant ERR_MARKET_NOT_FOUND u404)

;; Market Status
(define-constant STATUS_OPEN u1)
(define-constant STATUS_RESOLVED u2)

;; Market Map
(define-map markets
  { id: uint }
  {
    creator: principal,
    description: (string-utf8 500),
    status: uint
  }
)

;; Market Creation
(define-public (create-market
  (description (string-utf8 500))
)
  (let 
    ((market-id u1))
    (map-set markets 
      { id: market-id }
      {
        creator: tx-sender,
        description: description,
        status: STATUS_OPEN
      }
    )
    (ok market-id)
  )
)

;; Resolve Market
(define-public (resolve-market
  (market-id uint)
)
  (let 
    ((market (unwrap! (map-get? markets { id: market-id }) (err ERR_MARKET_NOT_FOUND))))
    (asserts! (is-eq tx-sender (get creator market)) (err ERR_UNAUTHORIZED))
    (map-set markets 
      { id: market-id }
      (merge market { status: STATUS_RESOLVED })
    )
    (ok true)
  )
)

;; Contract Version
(define-read-only (get-contract-version)
  (ok "Trendlink Prediction Market v1.0")
)
