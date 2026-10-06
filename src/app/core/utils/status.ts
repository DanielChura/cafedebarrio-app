export function getOrderStatusLabel(status: string): string {
  switch (status) {
    case 'DELIVERED':
      return 'Entregado';
    case 'PREPARING':
      return 'En preparación';
    case 'PENDING':
      return 'Pendiente';
    default:
      return status;
  }
}

export function getOrderStatusClass(status: string): string {
  switch (status) {
    case 'DELIVERED':
      return 'text-emerald-600 bg-emerald-100 border border-emerald-300';
    case 'PREPARING':
      return 'text-blue-500 bg-blue-100 border border-blue-300';
    case 'PENDING':
      return 'text-amber-600 bg-amber-100 border border-amber-300';
    default:
      return 'text-neutral-600 bg-neutral-100 border border-neutral-300';
  }
}

export function getReturnStatusLabel(status: string): string {
  switch (status?.toUpperCase()) {
    case 'REQUESTED':
      return 'Solicitada';
    case 'IN_REVIEW':
      return 'En revisión';
    case 'APPROVED':
      return 'Aprobada';
    case 'REJECTED':
      return 'Rechazada';
    case 'COMPLETED':
      return 'Completada';
    default:
      return status;
  }
}

export function getReturnStatusClass(status: string): string {
  switch (status?.toUpperCase()) {
    case 'REQUESTED':
      return 'text-amber-600 bg-amber-50 border border-amber-300';
    case 'IN_REVIEW':
      return 'text-blue-500 bg-blue-50 border border-blue-300';
    case 'APPROVED':
      return 'text-emerald-600 bg-emerald-50 border border-emerald-300';
    case 'REJECTED':
      return 'text-red-500 bg-red-50 border border-red-300';
    case 'COMPLETED':
      return 'text-neutral-600 bg-neutral-50 border border-neutral-300';
    default:
      return 'text-neutral-600 bg-neutral-50 border border-neutral-300';
  }
}
