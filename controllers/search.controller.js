import { BlogPost, Lookbook, Outfit, User } from "../models/index.js";
import { Op, Sequelize } from "sequelize";
import asyncWrapper from "../middleware/async.js";

export const searchAllForUsers = asyncWrapper(async (req, res) => {
  const { k: character } = req.query;

  const BlogsWithCharacter = await BlogPost.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("content")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
      ],
    },
  });

  const OutfitsWithCharacter = await Outfit.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("description")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
      ],
    },
  });

  const lookBooksWithCharacter = await Lookbook.findAll({
    where: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
      [Op.like]: `%${character.toLowerCase()}%`,
    }),
  });

  const searchResult = [
    ...BlogsWithCharacter,
    ...OutfitsWithCharacter,
    ...lookBooksWithCharacter,
  ];

  res.status(200).json({
    status: true,
    message: "Search results fetched successfully",
    data: searchResult,
  });
});

export const searchAllForAdmin = asyncWrapper(async (req, res) => {
  const { k: character } = req.query;

  const BlogsWithCharacter = await BlogPost.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("content")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
      ],
    },
  });

  const OutfitsWithCharacter = await Outfit.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("description")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
      ],
    },
  });

  const usersWithCharacter = await User.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("email")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
      ],
    },
  });

  const searchResult = [
    ...BlogsWithCharacter,
    ...OutfitsWithCharacter,
    ...usersWithCharacter,
  ];

  res.status(200).json({
    status: true,
    message: "Search results fetched successfully",
    data: searchResult,
  });
});

export const searchBlogs = asyncWrapper(async (req, res) => {
  const { k: character } = req.query;

  const BlogsWithCharacter = await BlogPost.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("content")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
      ],
    },
  });

  res.status(200).json({
    status: true,
    message: "Search results fetched successfully",
    data: BlogsWithCharacter,
  });
});

export const searchOutfits = asyncWrapper(async (req, res) => {
  const { k: character } = req.query;

  const OutfitsWithCharacter = await Outfit.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("description")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
      ],
    },
  });

  res.status(200).json({
    status: true,
    message: "Search results fetched successfully",
    data: OutfitsWithCharacter,
  });
});

export const searchLookBook = asyncWrapper(async (req, res) => {
  const { k: character } = req.query;

  const lookBooksWithCharacter = await BlogPost.findAll({
    where: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
      [Op.like]: `%${character.toLowerCase()}%`,
    }),
  });

  res.status(200).json({
    status: true,
    message: "Search results fetched successfully",
    data: lookBooksWithCharacter,
  });
});

export const searchUsers = asyncWrapper(async (req, res) => {
  const { k: character } = req.query;

  const usersWithCharacter = await User.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("email")), {
          [Op.like]: `%${character.toLowerCase()}%`,
        }),
      ],
    },
  });

  res.status(200).json({
    status: true,
    message: "Search results fetched successfully",
    data: usersWithCharacter,
  });
});
