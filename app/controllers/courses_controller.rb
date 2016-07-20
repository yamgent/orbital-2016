class CoursesController < ApplicationController
  before_action :set_course, only: [:show, :edit, :update, :destroy,
                                      :add_student, :remove_student]
  before_action :authorize_admin

  # GET /courses
  def index
    @edit_all_courses = Course.all
  end

  # GET /courses/new
  def new
    @edit_course = Course.new
  end

  # POST /courses
  def create
    @edit_course = Course.new(course_params)

    respond_to do |format|
      if @edit_course.save
        format.html { redirect_to @edit_course, notice: 'Course was successfully created.' }
        format.json { render :show, status: :created, location: @edit_course }
      else
        format.html { render :new }
        format.json { render json: @edit_course.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /courses/1
  # PATCH/PUT /courses/1.json
  def update
    respond_to do |format|
      if @edit_course.update(course_params)
        format.html { redirect_to @edit_course, notice: 'Course was successfully updated.' }
        format.json { render :show, status: :ok, location: @edit_course }
      else
        format.html { render :edit }
        format.json { render json: @edit_course.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /courses/1
  # DELETE /courses/1.json
  def destroy
    respond_to do |format|
      if @edit_course.destroy
        format.html { redirect_to courses_url, notice: 'Course was successfully destroyed.' }
        format.json { head :no_content }
      else
        format.html { redirect_to courses_url,
          alert: 'Illegal Operation: Ensure that all users are no longer enrolled, and all lectures/tutorials are deleted.' }
        format.json { head :no_content }
      end
    end
  end

  def show
    @edit_enrolled = @edit_course.users
  end

  # POST /courses/add_student/:course_id?student=id
  def add_student
    courseId = params[:id]
    studentId = params[:student]

    respond_to do |format|
      if UserCourseSelection.find_by(course_id: courseId, user_id: studentId)
        format.html { redirect_to @edit_course, alert: 'This student is already in the course!' }
        format.json { head :no_content }
      else
        record = UserCourseSelection.new(course_id: courseId, user_id: studentId)

        if record.save
          format.html { redirect_to @edit_course, notice: 'Student added successfully' }
          format.json { head :no_content }
        else
          format.html { redirect_to @edit_course }  # TODO: Does not reveal error message!
          format.json { render json: @edit_course.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  # DELETE/courses/remove_student/:course_id?student=id
  def remove_student
    courseId = params[:id]
    studentId = params[:student]

    record = find_student(courseId, studentId)
    if record
      also_delete_tutorial_selections(studentId)
      record.delete
    end

    respond_to do |format|
      format.html { redirect_to @edit_course, notice: 'Student removed' }
      format.json { head :no_content }
    end
  end

  def edit
  end

  private
    def also_delete_tutorial_selections(student_id)
      # Wang Leng: This is probably my fault. UserTutorialSelection
      # should be related to UserCourseSelection so that when the
      # user drops the course, it also drops all tutorial selections.
      # However, this relationship does not exist in the database,
      # and the changes required is more than just merely adding
      # a single foreign key, therefore, we will have to do it
      # manually by executing this method.

      @edit_course.tutorials.each do |tut|
        tut_selection = UserTutorialSelection.find_by(user_id: student_id, tutorial_id: tut.id)
        if tut_selection.nil? == false
          tut_selection.delete
        end
      end
    end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_course
      @edit_course = Course.find(params[:id])
    end

  private
    def find_student(courseId, studentId)
      return UserCourseSelection.find_by(course_id: courseId, user_id: studentId)
    end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def course_params
      params.require(:course).permit(:name, :code)
    end
end
