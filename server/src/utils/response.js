const ok      = (res, data = {}, status = 200) => res.status(status).json(data)
const created = (res, data = {})               => res.status(201).json(data)
const noContent = (res)                        => res.status(204).send()
const badRequest  = (res, msg) => res.status(400).json({ message: msg })
const unauthorized= (res, msg='No autorizado')              => res.status(401).json({ message: msg })
const forbidden   = (res, msg='Acceso denegado')            => res.status(403).json({ message: msg })
const notFound    = (res, msg='Recurso no encontrado')      => res.status(404).json({ message: msg })
const conflict    = (res, msg='Conflicto con recurso actual')=> res.status(409).json({ message: msg })
const serverError = (res, err) => {
  console.error(err)
  res.status(500).json({ message: 'Error interno del servidor' })
}

module.exports = { ok, created, noContent, badRequest, unauthorized, forbidden, notFound, conflict, serverError }
