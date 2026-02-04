import ContentLayout from "@/layouts/content-layout";

export default function Topics({
  curso,
  materia
}) {

  console.log(curso);
  console.log(materia);


  return (
    <ContentLayout>
      <section className="topics">
        <h1>Temas Asociados</h1>
      </section>
    </ContentLayout>
  )
}