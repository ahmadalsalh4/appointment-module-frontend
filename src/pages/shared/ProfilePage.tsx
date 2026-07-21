import { useAuth } from "../../contexts/auth/useAuth";
import { useProfile } from "../../hooks/useProfile"; // Import the hook
import Loading from "../../components/Loading";
import Error from "../../components/Error";

export default function ProfilePage() {
  const { role } = useAuth();

  // Pass the role here!
  const { data: profile, isPending, isError, error } = useProfile(role);

  if (isPending) return <Loading message="Profil yükleniyor..." />;
  if (isError)
    return (
      <Error
        message={
          error?.response?.data?.message ||
          "Profil bilgileri yüklenirken bir hata oluştu."
        }
      />
    );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const roleLabels: Record<string, string> = {
    customer: "Müşteri",
    staff: "Personel",
    admin: "Yönetici",
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-main">Profilim</h1>
        <p className="mt-1 text-sm text-main/70">
          Kişisel bilgilerinizi görüntüleyin ve yönetin.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm border border-main/10">
        <div className="h-2 bg-deep"></div>

        <div className="p-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
            <div className="mb-4 flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-deep/10 text-3xl font-bold text-deep sm:mb-0">
              {profile.person.name.charAt(0).toUpperCase()}
              {profile.person.surname.charAt(0).toUpperCase()}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-main">
                {profile.person.name} {profile.person.surname}
              </h2>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-deep/10 px-3 py-1 text-xs font-semibold text-deep">
                  {roleLabels[role || ""] || role}
                </span>
                <span className="rounded-full bg-main/5 px-3 py-1 text-xs font-medium text-main/70">
                  ID: #{profile.id}
                </span>
              </div>
            </div>
          </div>

          <div className="my-8 border-t border-dashed border-main/10"></div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-main/50">
                E-posta Adresi
              </dt>
              <dd className="mt-1 text-sm font-medium text-main">
                {profile.email}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-main/50">
                Telefon Numarası
              </dt>
              <dd className="mt-1 text-sm font-medium text-main">
                {profile.person.phone_number}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-main/50">
                Kayıt Tarihi
              </dt>
              <dd className="mt-1 text-sm font-medium text-main">
                {formatDate(profile.created_at)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-main/50">
                Son Güncelleme
              </dt>
              <dd className="mt-1 text-sm font-medium text-main">
                {formatDate(profile.updated_at)}
              </dd>
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-main/10 pt-6">
            <button className="inline-flex items-center gap-2 rounded-lg bg-deep px-6 py-2.5 text-sm font-semibold text-surface shadow-md transition-all hover:bg-deep/90 hover:shadow-lg active:scale-95">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Profili Düzenle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
