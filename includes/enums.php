<?php
declare(strict_types=1);

/**
 * ExtoArts — Backed enums for domain constants.
 *
 * PHP 8.1+ backed enums replace the scattered string literals
 * ('admin', 'client', 'pending', …) with type-safe, IDE-friendly values.
 *
 * Backward compat: every case's ->value is the same raw string that was
 * previously compared with ===, so existing DB rows and session arrays
 * are compatible without a migration.
 */

/** Roles stored in users.role */
enum UserRole: string
{
    case Admin  = 'admin';
    case Client = 'client';
    case Editor = 'editor';

    /** True when this role has full administrative access. */
    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }

    /** Convert a raw DB/session string to a UserRole, or null if unrecognised. */
    public static function tryFromString(string $role): ?self
    {
        return self::tryFrom($role);
    }
}

/** Lifecycle states stored in users.status */
enum UserStatus: string
{
    case Active  = 'active';
    case Pending = 'pending';
    case Banned  = 'banned';

    public function isActive(): bool  { return $this === self::Active; }
    public function isBanned(): bool  { return $this === self::Banned; }
    public function isPending(): bool { return $this === self::Pending; }
}

/** Lifecycle states stored in orders.status */
enum OrderStatus: string
{
    case Pending    = 'pending';
    case InProgress = 'in_progress';
    case Review     = 'review';
    case Completed  = 'completed';
    case Cancelled  = 'cancelled';
}
