import { useTutorProfile } from "@/hooks/useTutorProfile";
import TutorProfileForm from "./TutorProfileForm";
import TutorUpdateForm from "./TutorUpdateForm";

export default function TutorProfile() {
    const { data: tutor, isLoading } = useTutorProfile()
    if (isLoading) {
        return <div className="text-center text-blue-500">Loading...</div>;
    }
    console.log(tutor);
    return (
        <div className="container">
            {/* if tutor use TutorUpdateForm */}
            {tutor ? <TutorUpdateForm tutorData={tutor} /> : <TutorProfileForm />}
        </div>
    )
}