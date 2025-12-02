using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace PruebaTecnica.Models;

public partial class PruebaTContext : DbContext
{
    public PruebaTContext()
    {
    }

    public PruebaTContext(DbContextOptions<PruebaTContext> options)
        : base(options)
    {
    }

    public virtual DbSet<DetallesSolicitud> DetallesSolicituds { get; set; }

    public virtual DbSet<Empleado> Empleados { get; set; }

    public virtual DbSet<Equipo> Equipos { get; set; }

    public virtual DbSet<HistorialAsignacione> HistorialAsignaciones { get; set; }

    public virtual DbSet<PerfilesRequerimiento> PerfilesRequerimientos { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SolicitudesEquipamiento> SolicitudesEquipamientos { get; set; }

    public virtual DbSet<TokensRevocado> TokensRevocados { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DetallesSolicitud>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Detalles__3213E83F1920BF5C");

            entity.ToTable("DetallesSolicitud");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CantidadPuestos).HasColumnName("cantidad_puestos");
            entity.Property(e => e.RolId).HasColumnName("rol_id");
            entity.Property(e => e.SolicitudId).HasColumnName("solicitud_id");

            entity.HasOne(d => d.Rol).WithMany(p => p.DetallesSolicituds)
                .HasForeignKey(d => d.RolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetallesSolicitud_Rol");

            entity.HasOne(d => d.Solicitud).WithMany(p => p.DetallesSolicituds)
                .HasForeignKey(d => d.SolicitudId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DetallesSolicitud_Solicitud");
        });

        modelBuilder.Entity<Empleado>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Empleado__3213E83F03317E3D");

            entity.HasIndex(e => e.Email, "UQ__Empleado__AB6E6164267ABA7A").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Activo)
                .HasDefaultValue(true)
                .HasColumnName("activo");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.NombreCompleto)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("nombre_completo");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.PasswordSalt)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("password_salt");
            entity.Property(e => e.RolActualId).HasColumnName("rol_actual_id");

            entity.HasOne(d => d.RolActual).WithMany(p => p.Empleados)
                .HasForeignKey(d => d.RolActualId)
                .HasConstraintName("FK_Empleados_Roles");
        });

        modelBuilder.Entity<Equipo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Equipos__3213E83F07F6335A");

            entity.HasIndex(e => e.NumeroSerie, "UQ__Equipos__D8D7353C0AD2A005").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Costo)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("costo");
            entity.Property(e => e.Especificaciones).HasColumnName("especificaciones");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("estado");
            entity.Property(e => e.Modelo)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("modelo");
            entity.Property(e => e.NumeroSerie)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("numero_serie");
            entity.Property(e => e.TipoEquipo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("tipo_equipo");
        });

        modelBuilder.Entity<HistorialAsignacione>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Historia__3213E83F1ED998B2");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Accion)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("accion");
            entity.Property(e => e.EmpleadoId).HasColumnName("empleado_id");
            entity.Property(e => e.EquipoId).HasColumnName("equipo_id");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fecha");
            entity.Property(e => e.Responsable).HasColumnName("responsable");

            entity.HasOne(d => d.Empleado).WithMany(p => p.HistorialAsignacioneEmpleados)
                .HasForeignKey(d => d.EmpleadoId)
                .HasConstraintName("FK_Historial_Empleado");

            entity.HasOne(d => d.Equipo).WithMany(p => p.HistorialAsignaciones)
                .HasForeignKey(d => d.EquipoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Historial_Equipo");

            entity.HasOne(d => d.ResponsableNavigation).WithMany(p => p.HistorialAsignacioneResponsableNavigations)
                .HasForeignKey(d => d.Responsable)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Historial_Responsable");
        });

        modelBuilder.Entity<PerfilesRequerimiento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Perfiles__3213E83F0EA330E9");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CantidadRequerida).HasColumnName("cantidad_requerida");
            entity.Property(e => e.RolId).HasColumnName("rol_id");
            entity.Property(e => e.TipoEquipo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("tipo_equipo");

            entity.HasOne(d => d.Rol).WithMany(p => p.PerfilesRequerimientos)
                .HasForeignKey(d => d.RolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Perfiles_Rol");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Roles__3213E83F7F60ED59");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.NombreRol)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre_rol");
        });

        modelBuilder.Entity<SolicitudesEquipamiento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Solicitu__3213E83F1367E606");

            entity.ToTable("SolicitudesEquipamiento");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreadoPor).HasColumnName("creado_por");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("estado");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fecha");
            entity.Property(e => e.NombreSolicitud)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("nombre_solicitud");

            entity.HasOne(d => d.CreadoPorNavigation).WithMany(p => p.SolicitudesEquipamientos)
                .HasForeignKey(d => d.CreadoPor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Solicitudes_Empleado");
        });

        modelBuilder.Entity<TokensRevocado>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TokensRe__3214EC072A4B4B5E");

            entity.Property(e => e.FechaRevocado).HasColumnType("datetime");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
