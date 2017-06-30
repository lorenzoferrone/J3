import treeModel from 'tree-model'

export const tree = new treeModel()

export const clone = (object) => tree.parse(object.model)

export const getById = (t, id) => t.first(node => node.model.id == id)
