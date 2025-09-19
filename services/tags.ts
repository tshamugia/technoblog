import { cache } from "react";
import prisma from "@/db/client";
import {
  type CreateTagData,
  convertTagForUI,
  failure,
  type Result,
  success,
  type Tag,
  type TagWithCount,
} from "@/types/database";

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const getTags = cache(async (limit?: number): Promise<Result<Tag[]>> => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
      },
      orderBy: [{ isOfficial: "desc" }, { name: "asc" }],
      ...(limit && { take: limit }),
    });

    const convertedTags = tags.map(convertTagForUI);
    return success(convertedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return failure("Failed to fetch tags");
  }
});

export const getTagBySlug = cache(
  async (slug: string): Promise<Result<Tag | null>> => {
    try {
      const tag = await prisma.tag.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              posts: {
                where: {
                  post: {
                    status: "PUBLISHED",
                  },
                },
              },
            },
          },
        },
      });

      if (!tag) {
        return success(null);
      }

      return success(convertTagForUI(tag));
    } catch (error) {
      console.error("Error fetching tag by slug:", error);
      return failure("Failed to fetch tag");
    }
  }
);

export async function createTag(data: CreateTagData): Promise<Result<Tag>> {
  try {
    const slug = data.slug || generateSlug(data.name);

    const tag = await prisma.tag.create({
      data: {
        ...data,
        slug,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return success(convertTagForUI(tag));
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return failure("A tag with this slug already exists", 409);
    }
    return failure("Failed to create tag");
  }
}

export async function getOfficialTags(limit?: number): Promise<Result<Tag[]>> {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        isOfficial: true,
      },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      ...(limit && { take: limit }),
    });

    const convertedTags = tags.map(convertTagForUI);
    return success(convertedTags);
  } catch (error) {
    console.error("Error fetching official tags:", error);
    return failure("Failed to fetch official tags");
  }
}

export async function searchTags(
  query: string,
  limit = 10
): Promise<Result<Tag[]>> {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
      },
      orderBy: [{ isOfficial: "desc" }, { name: "asc" }],
      take: limit,
    });

    const convertedTags = tags.map(convertTagForUI);
    return success(convertedTags);
  } catch (error) {
    console.error("Error searching tags:", error);
    return failure("Failed to search tags");
  }
}

// UI-compatible functions
export async function getTrendingTags(limit = 10): Promise<Tag[]> {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
      },
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      take: limit,
    });

    return tags.map((tag) => ({
      id: tag.id,
      slug: tag.slug,
      name: tag.name,
      description: tag.description || undefined,
      post_count: tag._count.posts,
    }));
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    return [];
  }
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
      },
      orderBy: [{ isOfficial: "desc" }, { name: "asc" }],
    });

    return tags.map((tag) => ({
      id: tag.id,
      slug: tag.slug,
      name: tag.name,
      description: tag.description || undefined,
      post_count: tag._count.posts,
    }));
  } catch (error) {
    console.error("Error fetching all tags:", error);
    return [];
  }
}
