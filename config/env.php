<?php
declare(strict_types=1);
/**
 * ExtoArts - Environment Detection
 *
 * Centralises all "where am I running?" logic so every other file can
 * ask a single, explicit question instead of duplicating host-name checks.
 *
 * Usage:
 *   require_once __DIR__ . '/../config/env.php';
 *   if (Env::isProd()) { ... }
 *   error_log('[ExtoArts] ' . Env::context() . ': something happened');
 *
 * This file is read-only: it detects the environment, it does not set it.
 * To change behaviour, adjust the PROD_HOSTS list or add an APP_ENV env var.
 */

final class Env
{
    /** Hostnames that are treated as production. */
    private const PROD_HOSTS = ['extoarts.in', 'www.extoarts.in'];

    /** Cached result — computed once per request. */
    private static ?bool $prod = null;

    /**
     * Returns true when running on the live production domain.
     * Uses the forwarded proto header so it works behind Cloudflare.
     */
    public static function isProd(): bool
    {
        if (self::$prod !== null) return self::$prod;

        $host = strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]);
        return self::$prod = in_array($host, self::PROD_HOSTS, true);
    }

    /** Returns true in any non-production context (Replit, local, staging). */
    public static function isDev(): bool
    {
        return !self::isProd();
    }

    /**
     * A short string identifying the current runtime, useful in log lines.
     *
     * Examples:  "prod", "replit", "local"
     */
    public static function context(): string
    {
        if (self::isProd()) return 'prod';

        $host = $_SERVER['HTTP_HOST'] ?? '';
        if (str_contains($host, 'replit') || str_contains($host, 'repl.co')) return 'replit';

        return 'local';
    }

    /**
     * Returns the canonical base URL for the current environment.
     * Useful for building absolute links without hardcoding the domain.
     */
    public static function baseUrl(): string
    {
        if (self::isProd()) return 'https://extoarts.in';

        $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        return $proto . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost:5000');
    }
}
