import { Sequelize, Model, DataTypes, BuildOptions, Op, ModelCtor } from 'sequelize';
import fs from 'fs';

interface ModelAttributes {
  [key: string]: {
    type: any; // Define your data types here
  };
}

interface ModelDefinition {
  definition: ModelAttributes;
  relations?: {
    belongsTo?: { table: string; as: string; onDelete: string }[];
    hasMany?: { table: string; as: string; onDelete: string }[];
  };
}

class Conn {
  private db: Sequelize;
  private path: string;

  constructor(modelsPath: string) {
    this.db = new Sequelize("kwanso","root", "root", {
      host: "127.0.0.1",
      port: 3306,
      dialect: "mysql",
      logging: false,
    });

    this.path = modelsPath;

    this.initializeModels();
  }

  private async initializeModels() {
    try {
      const files = await fs.promises.readdir(this.path);

      for (const file of files) {
        const modelJson: ModelDefinition = require(this.path + file);
        const modelName = file.split('.')[0];

        let model: ModelCtor<Model<any, any>>; // Corrected type

        try {
          model = this.db.model(modelName);
        } catch (e) {
          model = this.db.define(modelName, modelJson.definition, {
            tableName: modelName,
            createdAt: 'created_on',
            updatedAt: 'updated_on',
            underscored: true,
          });

          await model.sync();
        }
      }

      await this.defineRelations();
    } catch (err) {
      console.log((err as Error).message);
    }
  }

  private async defineRelations() {
    try {
      const files = await fs.promises.readdir(this.path);
      const modelAttributesMap = new Map<string, ModelAttributes>();

      for (const file of files) {
        const modelJson: ModelDefinition = require(this.path + file);
        const modelName = file.split('.')[0];
        const modelAttributes = modelJson.definition;
        modelAttributesMap.set(modelName, modelAttributes);
      }

      const queryInterface = this.db.getQueryInterface();

      for (const [modelName, modelAttributes] of modelAttributesMap) {
        const tableAttributes = await queryInterface.describeTable(modelName);
        const attributesToAdd = [];

        for (const attribute of Object.keys(modelAttributes)) {
          if (!tableAttributes[attribute]) {
            const attributeDefinition = modelAttributes[attribute];
            attributesToAdd.push(queryInterface.addColumn(modelName, attribute, attributeDefinition));
            console.log(`=== added column '${attribute}' to table '${modelName}' ===`);
          }
        }

        await Promise.all(attributesToAdd);
      }

      for (const file of files) {
        const modelJson: ModelDefinition = require(this.path + file);
        const modelName = file.split('.')[0];

        if (modelJson.relations?.belongsTo) {
          for (const item of modelJson.relations?.belongsTo) {
            (this.db.model(modelName) as ModelCtor<Model<any, any>>).belongsTo(
              this.db.model(item.table) as ModelCtor<Model<any, any>>, 
              { as: item.as, onDelete: item.onDelete }
            );
            
          }
        }

        if (modelJson.relations?.hasMany) {
          for (const item of modelJson.relations?.hasMany) {
            (this.db.model(modelName) as ModelCtor<Model<any, any>>).hasMany(
              this.db.model(item.table) as ModelCtor<Model<any, any>>, 
              { as: item.as, onDelete: item.onDelete }
            );
            
          }
        }

        await (this.db.model(modelName) as ModelCtor<Model<any, any>>).sync();
        console.log('relation defined for', modelName);
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  }
}

export default Conn;
