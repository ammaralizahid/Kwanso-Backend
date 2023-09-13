import { DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
    id: number;
    name: string;
    password: string;
    email: string;
    role: string | null;
    archive: boolean;
    created_by: number | null;
    updated_by: number | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export const definition = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                args: true,
                msg: "Email is not valid"
            },
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    archive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
};

export const relations = {
    hasMany: [
        {
            table: 'Tasks',
            as: 'taskUser',
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        },
    ],
};

export const permissions = {
    'Seller': {
        id: { write: true, slug: "Id" },
        name: { write: true, slug: "Name" },
        email: { write: true, slug: "Email" },
        password: { write: true, slug: "Password" },
    }
};

export const access_limiter = {
    roles: {
        "Seller": {},
    }
};

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public password!: string;
    public email!: string;
    public role!: string | null;
    public archive!: boolean;
    public created_by!: number | null;
    public updated_by!: number | null;
}

export default User;
