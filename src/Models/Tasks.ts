import { DataTypes, Model, Optional } from 'sequelize';

interface CarAttributes {
    id: number;
    name: string;
    created_by: number | null;
    archive: boolean;
    updated_by: number | null;
}

interface CarCreationAttributes extends Optional<CarAttributes, 'id'> {}

export const definition = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    archive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
};

export const relations = {
    belongsTo: [
        {
            table: 'Users',
            as: 'user',
            foreignKey: 'userId',
        }
    ],
};

export const permissions = {
    'Seller': {
        id: { write: true, slug: "Id" },
        name: { write: true, slug: "Name" },
    }
};

export const access_limiter = {
    roles: {
        "Seller": {},
    }
};

class Car extends Model<CarAttributes, CarCreationAttributes> implements CarAttributes {
    public id!: number;
    public name!: string;
    public created_by!: number | null;
    public archive!: boolean;
    public updated_by!: number | null;
}

export default Car;
