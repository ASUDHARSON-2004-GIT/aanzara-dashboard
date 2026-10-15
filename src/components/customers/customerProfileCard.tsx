import type { ReactNode } from "react";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { CustomerDetail } from "@/types/customers";
import Card from "../ui/Card";
import CustomerAvatar from "./customerAvatar";
import CustomerTypeBadge from "./customerTypeBadge";

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-400">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-gray-400">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-medium text-gray-900">{children}</dd>
      </div>
    </div>
  );
}

export default function CustomerProfileCard({ customer }: { customer: CustomerDetail }) {
  return (
    <Card title="Customer Details">
      <div className="mb-5 flex items-center gap-4">
        <CustomerAvatar name={customer.name} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-gray-900">{customer.name}</p>
          <div className="mt-1">
            <CustomerTypeBadge type={customer.type} />
          </div>
        </div>
      </div>

      <dl className="space-y-4 border-t border-gray-100 pt-4">
        <Row icon={<Mail size={16} />} label="Email">
          <a href={`mailto:${customer.email}`} className="hover:text-orange-600">
            {customer.email}
          </a>
        </Row>
        <Row icon={<Phone size={16} />} label="Phone">
          <a href={`tel:${customer.phone.replace(/\s/g, "")}`} className="hover:text-orange-600">
            {customer.phone}
          </a>
        </Row>
        <Row icon={<MapPin size={16} />} label="Location">
          {customer.city}, {customer.state}
        </Row>
        <Row icon={<CalendarDays size={16} />} label="Customer since">
          {formatDate(customer.joinedAt)}
        </Row>
      </dl>
    </Card>
  );
}