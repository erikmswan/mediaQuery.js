
'>300 && <800 || (<400 && >1600 && (>1200 || <706))'

[
  { values: [300, 800, true]}
]

[
  { logic: [&&, ||, &&], values: [200, false, 600, 100], comparison: [<, >, >=] },
  [
    { logic: [&&], values: [200], comparison: [<] },
    { logic: [&&], values: [200], comparison: [<] },
    { logic: [&&], values: [200], comparison: [<] }
  ]
  [
    { logic: [&&], values: [200], comparison: [<] },
    [
      { logic: [&&], values: [200], comparison: [<] },
      { logic: [&&], values: [200], comparison: [<] }
    ]
  ]
]
