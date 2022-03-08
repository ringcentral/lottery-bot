/**
 * ringcentral id and github id mapping
 */

import Sequelize from 'sequelize'
import sequelize from './sequelize'

export const Record = sequelize.define('Record', {
  id: { // should be userId-id
    type: Sequelize.STRING,
    primaryKey: true
  },
  batchId: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.STRING
  },
  botId: {
    type: Sequelize.STRING
  },
  groupId: {
    type: Sequelize.STRING
  },
  data: {
    type: Sequelize.JSON
  },
  members: {
    type: Sequelize.JSON
  },
  onPicking: { // 1 on picking, 0 not picking
    type: Sequelize.INTEGER
  }
})
